#!/bin/bash
cd "$(dirname "$0")"
npm test -- --watch=false --browsers=ChromeHeadless
