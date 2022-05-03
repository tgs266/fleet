package git

import (
	gerrs "errors"
	"os"
	"path/filepath"

	"github.com/go-git/go-git/v5"
	"github.com/tgs266/fleet/lib/errors"
)

type GitManager struct {
	Path     string
	RepoPath string
}

func New(path string) *GitManager {

	os.MkdirAll(filepath.Dir(path), 0770)
	os.Mkdir(path, 0770)
	os.Mkdir(filepath.Join(path, "repos"), 0770)

	return &GitManager{
		Path:     path,
		RepoPath: filepath.Join(path, "repos"),
	}
}

func (self *GitManager) CreateRepository(resourceType string, name string) (*Repository, error) {
	resourcePath := filepath.Join(self.RepoPath, resourceType)

	if _, err := os.Stat(resourcePath); os.IsNotExist(err) {
		os.Mkdir(resourcePath, 0770)
	}
	repo, err := git.PlainInit(filepath.Join(resourcePath, name), false)
	if err != nil {
		if gerrs.Is(err, git.ErrRepositoryAlreadyExists) {
			return nil, NewResourceAlreadyExists(resourceType, name)
		}
		return nil, errors.ParseInternalError(err)
	}
	return &Repository{
		Name:         name,
		ResourceType: resourceType,
		Path:         filepath.Join(resourcePath, name),
		repository:   repo,
	}, nil
}

func (self *GitManager) GetRepository(resourceType string, name string) (*Repository, error) {
	repoPath := filepath.Join(self.RepoPath, resourceType, name)

	repo, err := git.PlainOpen(repoPath)

	if err != nil {
		if gerrs.Is(err, git.ErrRepositoryNotExists) {
			return nil, NewRepositoryNotFound(resourceType, name)
		}
		return nil, errors.ParseInternalError(err)
	}

	return &Repository{
		Name:         name,
		ResourceType: resourceType,
		Path:         repoPath,
		repository:   repo,
	}, nil
}
