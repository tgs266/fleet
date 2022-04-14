package common

func HandleErrorPanic(err error) {
	if err != nil {
		panic(err)
	}
}
