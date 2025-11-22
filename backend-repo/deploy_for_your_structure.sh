#!/bin/bash

# NETRA Backend - Quick Deployment for Your Project Structure
# This script sets up the backend in your existing project

echo "========================================"
echo "NETRA Backend Quick Setup"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check current directory
if [[ ! -d "backend-repo" ]]; then
    echo -e "${YELLOW}It looks like you're not in your project root.${NC}"
    echo "This script should be run from the directory containing backend-repo/"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Navigate to backend-repo
cd backend-repo 2>/dev/null || {
    echo -e "${RED}Error: backend-repo directory not found${NC}"
    echo "Please run this script from your project root directory"
    exit 1
}

echo -e "${GREEN}✓ Found backend-repo directory${NC}"
echo ""

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found${NC}"

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL not found${NC}"
    echo "Please install PostgreSQL before continuing"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL found${NC}"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check for data directory
echo ""
if [[ ! -d "data" ]]; then
    echo -e "${YELLOW}Data directory not found. Creating it...${NC}"
    mkdir data
    
    # Try to find JSON files
    if [[ -d "../scraped_data/all_data" ]]; then
        echo "Found scraped data at ../scraped_data/all_data"
        read -p "Copy JSON files to backend data directory? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp ../scraped_data/all_data/*.json data/
            echo -e "${GREEN}✓ JSON files copied${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Could not find scraped data${NC}"
        echo "Please manually copy your JSON files to backend-repo/data/"
    fi
else
    echo -e "${GREEN}✓ Data directory exists${NC}"
fi

# Create .env if it doesn't exist
echo ""
if [[ ! -f ".env" ]]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit .env file with your database credentials${NC}"
    
    # Offer to set up database
    read -p "Set up PostgreSQL database now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter database name (default: netra_news): " db_name
        db_name=${db_name:-netra_news}
        
        read -p "Enter database user (default: netra_user): " db_user
        db_user=${db_user:-netra_user}
        
        read -s -p "Enter database password: " db_password
        echo
        
        echo ""
        echo "Creating database..."
        sudo -u postgres psql -c "CREATE DATABASE $db_name;" 2>/dev/null
        sudo -u postgres psql -c "CREATE USER $db_user WITH PASSWORD '$db_password';" 2>/dev/null
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;" 2>/dev/null
        sudo -u postgres psql -c "ALTER DATABASE $db_name OWNER TO $db_user;" 2>/dev/null
        
        # Update .env
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$db_user:$db_password@localhost:5432/$db_name|g" .env
        
        echo -e "${GREEN}✓ Database created and configured${NC}"
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Load data
echo ""
read -p "Load data into database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Loading data..."
    
    # Use updated load_data if it exists, otherwise use regular one
    if [[ -f "load_data_updated.py" ]]; then
        python load_data_updated.py
    else
        python load_data.py
    fi
fi

# Setup frontend API integration
echo ""
read -p "Set up frontend API integration? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    FRONTEND_DIR="../frontend-repo/netra-app"
    
    if [[ -d "$FRONTEND_DIR" ]]; then
        # Create api directory if it doesn't exist
        mkdir -p "$FRONTEND_DIR/src/api"
        
        # Copy API service file
        if [[ -f "react-api-service.js" ]]; then
            cp react-api-service.js "$FRONTEND_DIR/src/api/api.js"
            echo -e "${GREEN}✓ API service file copied to frontend${NC}"
        fi
        
        # Check if axios is installed
        cd "$FRONTEND_DIR"
        if ! grep -q "axios" package.json 2>/dev/null; then
            echo ""
            echo "Installing axios in frontend..."
            npm install axios
        fi
        cd - > /dev/null
        
        echo -e "${GREEN}✓ Frontend integration complete${NC}"
    else
        echo -e "${YELLOW}⚠ Frontend directory not found at $FRONTEND_DIR${NC}"
    fi
fi

# Final summary
echo ""
echo "========================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "========================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd backend-repo"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd frontend-repo/netra-app"
echo "   npm run dev"
echo ""
echo "3. Test API (Terminal 3):"
echo "   cd backend-repo"
echo "   source venv/bin/activate"
echo "   python test_api.py"
echo ""
echo "🌐 Access:"
echo "   Backend API: http://localhost:5000"
echo "   Frontend: http://localhost:5173 (or :3000)"
echo ""

# Offer to start server
read -p "Start backend server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}Starting Flask server...${NC}"
    echo "Press Ctrl+C to stop"
    echo ""
    python app.py
fi
