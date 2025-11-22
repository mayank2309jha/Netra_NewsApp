#!/bin/bash

# NETRA News Platform - Quick Start Script
# This script automates the backend setup process

echo "========================================"
echo "NETRA News Platform - Quick Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python 3 found${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL before continuing:"
    echo "  Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "  macOS: brew install postgresql"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL found${NC}"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit .env file with your database credentials${NC}"
fi

# Prompt for database setup
echo ""
read -p "Do you want to create the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: netra_news): " db_name
    db_name=${db_name:-netra_news}
    
    read -p "Enter database user (default: netra_user): " db_user
    db_user=${db_user:-netra_user}
    
    read -s -p "Enter database password: " db_password
    echo
    
    # Create database and user
    echo ""
    echo "Creating database..."
    sudo -u postgres psql -c "CREATE DATABASE $db_name;" 2>/dev/null
    sudo -u postgres psql -c "CREATE USER $db_user WITH PASSWORD '$db_password';" 2>/dev/null
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;" 2>/dev/null
    sudo -u postgres psql -c "ALTER DATABASE $db_name OWNER TO $db_user;" 2>/dev/null
    
    # Update .env file
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$db_user:$db_password@localhost:5432/$db_name|g" .env
    
    echo -e "${GREEN}✓ Database created successfully${NC}"
fi

# Load data
echo ""
read -p "Do you want to load data from JSON files now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Loading data..."
    python load_data.py
fi

# Start the server
echo ""
echo "========================================"
echo -e "${GREEN}Setup complete!${NC}"
echo "========================================"
echo ""
echo "To start the server:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run the server: python app.py"
echo ""
echo "The API will be available at: http://localhost:5000"
echo ""

read -p "Do you want to start the server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting Flask server..."
    python app.py
fi
