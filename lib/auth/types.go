package auth

import (
	"errors"

	"k8s.io/client-go/tools/clientcmd/api"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Token    string `json:"token"`
}

type RefreshRequest struct {
	Token string `json:"token"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (request LoginRequest) GetAuthInfo() (*api.AuthInfo, error) {
	if len(request.Token) > 0 {
		return &api.AuthInfo{
			Token: request.Token,
		}, nil
	} else if len(request.Username) > 0 && len(request.Password) > 0 {
		return &api.AuthInfo{
			Username: request.Username,
			Password: request.Password,
		}, nil
	}
	return nil, errors.New("not enough info provided to authenticate user")
}
