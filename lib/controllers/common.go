package controllers

import "github.com/tgs266/fleet/lib/errors"

func matchParam(property string, url string, passed string) error {
	if url == passed {
		return nil
	}
	return errors.NewBadRequestNonMatchingUrl(property, url, passed)
}
