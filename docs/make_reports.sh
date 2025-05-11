#!/bin/bash
cd /home/jw/sites/vhs/docs
./url_test.py > /home/jw/sites/vhs/frontend/public/reports/url.txt
./api_test.py > /home/jw/sites/vhs/frontend/public/reports/api.txt

# Copy reports to frontend