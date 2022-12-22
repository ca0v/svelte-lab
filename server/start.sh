#!/bin/bash
waitress-serve --port=5500 --call server:create_app