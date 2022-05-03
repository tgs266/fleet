package git

import (
	"encoding/json"
	"os"
	"path/filepath"
	"time"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/tgs266/fleet/lib/types"
	"k8s.io/apimachinery/pkg/runtime"
)

type Repository struct {
	Name         string `json:"name"`
	ResourceType string `json:"resourceType"`
	Path         string `json:"path"`

	repository *git.Repository
}

type HistoryRequest struct {
	Offset   int
	PageSize int
}

type CommitLog struct {
	Author    string    `json:"author"`
	Hash      string    `json:"hash"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

func (self *Repository) Commit(username string, spec runtime.Object, message string) error {

	specBytes, _ := json.Marshal(spec)
	err := os.WriteFile(filepath.Join(self.Path, "spec.yml"), specBytes, 0644)
	if err != nil {
		return err
	}

	w, err := self.repository.Worktree()
	if err != nil {
		return err
	}

	w.Add(filepath.Join(self.Path, "spec.yml"))
	commit, err := w.Commit(message, &git.CommitOptions{
		Author: &object.Signature{
			Name: username,
			When: time.Now(),
		},
	})

	if err != nil {
		return err
	}

	_, err = self.repository.CommitObject(commit)
	if err != nil {
		return err
	}
	return nil
}

func (self *Repository) History(req HistoryRequest) (*types.PaginationResponse, error) {

	history, err := self.repository.Log(&git.LogOptions{
		All: true,
	})

	if err != nil {
		return nil, err
	}

	hist := []CommitLog{}
	totalCount := 0
	count := 0
	offset := req.Offset
	err = history.ForEach(func(c *object.Commit) error {
		totalCount += 1
		if offset > 0 {
			offset -= 1
			return nil
		}
		if count >= req.PageSize && req.PageSize != -1 {
			return nil
		}
		hist = append(hist, CommitLog{
			Author:    c.Author.Name,
			Hash:      c.Hash.String(),
			Message:   c.Message,
			Timestamp: c.Author.When,
		})
		count += 1

		return nil
	})

	p := &types.PaginationResponse{
		Items: hist,
		Total: totalCount,
		Count: len(hist),
	}

	if req.Offset > 0 {
		p.Offset = req.Offset
	}

	return p, err
}