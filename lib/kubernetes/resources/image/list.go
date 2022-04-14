package image

import (
	"context"
	"strings"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/tgs266/fleet/lib/errors"
)

func GetAllImages() ([]Image, error) {
	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}
	images, err := cli.ImageList(ctx, types.ImageListOptions{})
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	oImages := []Image{}

	for _, image := range images {
		if len(image.RepoTags) != 0 {
			rt := image.RepoTags[0]
			oImages = append(oImages, Image{
				Name: strings.Split(rt, ":")[0],
				Tag:  strings.Split(rt, ":")[1],
			})
		}
	}
	return oImages, nil
}
