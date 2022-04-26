package jwe

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/logging"
	"k8s.io/client-go/tools/clientcmd/api"
)

func TestEncryptDecrypt(t *testing.T) {
	logging.Init(logging.LVL_INFO)

	manager := New()
	info := &api.AuthInfo{
		Token: "asdf",
	}
	token, err := manager.Generate(*info)
	fmt.Println(err)
	assert.Nil(t, err)

	newInfo, err := manager.Decrypt(token)
	assert.Nil(t, err)

	assert.Equal(t, info.Token, newInfo.Token)
}
