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

func (self *AuthManager) ExtractAuthInfo(c *fiber.Ctx) (*api.AuthInfo, error) {
	authHeader := string(c.Request().Header.Peek("Authorization"))
	jweToken := string(c.Request().Header.Peek("jweToken"))

	// check authheader first, fail if it is invalid
	if strings.HasPrefix(authHeader, "Bearer ") {
		authHeader = strings.TrimPrefix(authHeader, "Bearer ")
		if len(authHeader) > 0 {
			return &api.AuthInfo{Token: authHeader}, nil
		} else {
			return nil, fleetErrs.NewInvalidBearerToken()
		}
	}

	if self.jweManager != nil {
		authInfo, err := self.jweManager.Decrypt(jweToken)
		if err != nil {
			return nil, err
		}
		return authInfo, nil
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
