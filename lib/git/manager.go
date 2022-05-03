package git

type GitManager struct {
	Path string
}

func New(path string) *GitManager {
	return &GitManager{
		Path: path,
	}
}
