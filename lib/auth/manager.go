package auth

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/auth/jwe"
	fleetErrs "github.com/tgs266/fleet/lib/errors"
	"k8s.io/client-go/tools/clientcmd/api"
)

type AuthManager struct {
	jweManager *jwe.JweManager
}

func New() *AuthManager {
	return &AuthManager{
		jweManager: jwe.New(),
	}
}

func HandleImpersonate(authInfo *api.AuthInfo, impersonate, impersonateGroups string) *api.AuthInfo {
	if len(impersonate) > 0 {
		authInfo.Impersonate = impersonate
		if len(impersonateGroups) > 0 {
			authInfo.ImpersonateGroups = strings.Split(impersonateGroups, ",")
		}
	}
	return authInfo
}

func (self *AuthManager) ExtractAuthInfo(c *fiber.Ctx) (*api.AuthInfo, error) {
	authHeader := string(c.Request().Header.Peek("Authorization"))
	jweToken := string(c.Request().Header.Peek("jweToken"))
	impersonate := string(c.Request().Header.Peek("Impersonate-User"))
	impersonateGroups := string(c.Request().Header.Peek("Impersonate-Groups"))

	// check authheader first, fail if it is invalid
	if strings.HasPrefix(authHeader, "Bearer ") {
		authHeader = strings.TrimPrefix(authHeader, "Bearer ")
		if len(authHeader) > 0 {
			authInfo := &api.AuthInfo{Token: authHeader}
			return HandleImpersonate(authInfo, impersonate, impersonateGroups), nil
		} else {
			return nil, fleetErrs.NewInvalidBearerToken()
		}
	}

	if self.jweManager != nil {
		authInfo, err := self.jweManager.Decrypt(jweToken)
		if err != nil {
			return nil, err
		}
		return HandleImpersonate(authInfo, impersonate, impersonateGroups), nil
	}

	return nil, fleetErrs.NewNoAuthenticationHeaderProvided()
}

func (self *AuthManager) HasAuthHeaders(c *fiber.Ctx) error {
	authHeader := string(c.Request().Header.Peek("Authorization"))
	jweToken := string(c.Request().Header.Peek("jweToken"))
	if len(authHeader) == 0 && len(jweToken) == 0 {
		return fleetErrs.NewNoAuthenticationHeaderProvided()
	}
	return nil
}

func (self *AuthManager) Login(request LoginRequest) (*LoginResponse, error) {
	authInfo, err := request.GetAuthInfo()
	if err != nil {
		return nil, err
	}
	return self.Encode(authInfo)
}

func (self *AuthManager) Encode(authInfo *api.AuthInfo) (*LoginResponse, error) {
	token, err := self.jweManager.Generate(*authInfo)
	if err != nil {
		return nil, err
	}
	return &LoginResponse{
		Token: token,
	}, nil
}

func (self *AuthManager) Refresh(request RefreshRequest) (*LoginResponse, error) {
	token := request.Token
	newToken, err := self.jweManager.RefreshToken(token)
	if err != nil {
		return nil, err
	}
	return &LoginResponse{
		Token: newToken,
	}, nil
}
