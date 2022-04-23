package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestComparable1(t *testing.T) {
	testCases := []struct {
		name     string
		v1       Comparable
		v2       Comparable
		operator Operator
		expected bool
	}{
		{
			name:     "test1",
			v1:       getComparable("a"),
			v2:       getComparable("b"),
			operator: EqualOperator,
			expected: false,
		},
		{
			name:     "test2",
			v1:       getComparable("a"),
			v2:       getComparable("b"),
			operator: GreaterThanOperator,
			expected: false,
		},
		{
			name:     "test3",
			v1:       getComparable("b"),
			v2:       getComparable("b"),
			operator: GreaterThanOrEqualOperator,
			expected: true,
		},
		{
			name:     "test4",
			v1:       getComparable("b"),
			v2:       getComparable("b"),
			operator: NotEqualOperator,
			expected: false,
		},
		{
			name:     "test4",
			v1:       getComparable("c"),
			v2:       getComparable("b"),
			operator: LessThanOrEqualOperator,
			expected: false,
		},
		{
			name:     "test4",
			v1:       getComparable("b"),
			v2:       getComparable("c"),
			operator: LessThanOperator,
			expected: true,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			assert.Equal(t, test.operator.Test(test.v1, test.v2), test.expected)
		})
	}
}
func TestComparable2(t *testing.T) {
	testCases := []struct {
		name     string
		v1       Comparable
		v2       Comparable
		operator Operator
		expected bool
	}{
		{
			name:     "test1",
			v1:       getComparable(int32(32)),
			v2:       getComparable(int64(32)),
			operator: EqualOperator,
			expected: false,
		},
		{
			name:     "test2",
			v1:       getComparable(80),
			v2:       getComparable(2),
			operator: GreaterThanOrEqualOperator,
			expected: true,
		},
		{
			name:     "test3",
			v1:       getComparable(80),
			v2:       getComparable(200),
			operator: LessThanOrEqualOperator,
			expected: true,
		},
		{
			name:     "test4",
			v1:       getComparable(80),
			v2:       getComparable(200),
			operator: LessThanOperator,
			expected: true,
		},
		{
			name:     "test5",
			v1:       getComparable(800),
			v2:       getComparable(200),
			operator: LessThanOperator,
			expected: false,
		},
		{
			name:     "test6",
			v1:       getComparable(80),
			v2:       getComparable(200),
			operator: LessThanOperator,
			expected: true,
		},
		{
			name:     "test7",
			v1:       getComparable(80),
			v2:       getComparable(200),
			operator: NotEqualOperator,
			expected: true,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			assert.Equal(t, test.operator.Test(test.v1, test.v2), test.expected)
		})
	}
}
