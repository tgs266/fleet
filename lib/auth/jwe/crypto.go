package jwe

import (
	"crypto/rand"
	"crypto/rsa"

	"github.com/tgs266/fleet/lib/logging"
	jose "gopkg.in/square/go-jose.v2"
)

type cryptoSystem struct {
	key *rsa.PrivateKey
}

func (self *cryptoSystem) Encrypter() jose.Encrypter {
	publicKey := &self.Key().PublicKey
	encrypter, err := jose.NewEncrypter(jose.A256GCM, jose.Recipient{Algorithm: jose.RSA_OAEP_256, Key: publicKey}, nil)
	if err != nil {
		panic(err)
	}

	return encrypter
}

func (self *cryptoSystem) Key() *rsa.PrivateKey {
	return self.key
}

func (self *cryptoSystem) Init() {
	logging.INFO("Generating JWE encryption key")

	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}

	self.key = privateKey
}
