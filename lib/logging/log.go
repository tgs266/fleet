package logging

import (
	"log"
	"os"
)

type LogLevel int64

const (
	LVL_DEBUG LogLevel = 0
	LVL_INFO           = 1
	LVL_WARN           = 2
	LVL_ERROR          = 3
)

var logMinLevel LogLevel = LVL_INFO

var (
	WarningLogger *log.Logger
	InfoLogger    *log.Logger
	ErrorLogger   *log.Logger
	DebugLogger   *log.Logger
)

func Init(minLevel LogLevel) {
	logMinLevel = minLevel

	InfoLogger = log.New(os.Stdout, "[INFO] ", log.Ldate|log.Ltime)
	WarningLogger = log.New(os.Stdout, "[WARN] ", log.Ldate|log.Ltime)
	ErrorLogger = log.New(os.Stdout, "[ERROR] ", log.Ldate|log.Ltime)
	DebugLogger = log.New(os.Stdout, "[DEBUG] ", log.Ldate|log.Ltime)
}

func INFO(v ...interface{}) {
	if LVL_INFO < logMinLevel {
		return
	}
	InfoLogger.Print(v...)
}

func DEBUG(v ...interface{}) {
	if LVL_DEBUG < logMinLevel {
		return
	}
	DebugLogger.Print(v...)
}

func WARN(v ...interface{}) {
	if LVL_WARN < logMinLevel {
		return
	}
	WarningLogger.Print(v...)
}

func ERROR(v ...interface{}) {
	if LVL_ERROR < logMinLevel {
		return
	}
	ErrorLogger.Print(v...)
}

func INFOf(format string, v ...interface{}) {
	if LVL_INFO < logMinLevel {
		return
	}
	InfoLogger.Printf(format, v...)
}

func DEBUGf(format string, v ...interface{}) {
	if LVL_DEBUG < logMinLevel {
		return
	}
	DebugLogger.Printf(format, v...)
}

func WARNf(format string, v ...interface{}) {
	if LVL_WARN < logMinLevel {
		return
	}
	WarningLogger.Printf(format, v...)
}

func ERRORf(format string, v ...interface{}) {
	if LVL_ERROR < logMinLevel {
		return
	}
	ErrorLogger.Printf(format, v...)
}
