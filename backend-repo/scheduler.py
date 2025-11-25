import os
import sys
import time
import argparse
import logging
from datetime import datetime
import subprocess
import signal

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('scheduler.log')
    ]
)
logger = logging.getLogger(__name__)

# Global flag for graceful shutdown
running = True


def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    global running
    logger.info("Shutdown signal received. Finishing current task and exiting...")
    running = False


def run_data_loader():
    """Execute the load_data_updated.py script"""
    script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'load_data_updated.py')
    
    if not os.path.exists(script_path):
        logger.error(f"Script not found: {script_path}")
        return False
    
    logger.info("=" * 60)
    logger.info(f"Starting data load at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)
    
    try:
        # Run the script as a subprocess
        result = subprocess.run(
            [sys.executable, script_path],
            capture_output=True,
            text=True,
            timeout=600  # 10 minute timeout
        )
        
        # Log stdout
        if result.stdout:
            for line in result.stdout.strip().split('\n'):
                logger.info(f"[LOADER] {line}")
        
        # Log stderr (if any)
        if result.stderr:
            for line in result.stderr.strip().split('\n'):
                logger.warning(f"[LOADER ERROR] {line}")
        
        if result.returncode == 0:
            logger.info("Data load completed successfully!")
            return True
        else:
            logger.error(f"Data load failed with return code: {result.returncode}")
            return False
            
    except subprocess.TimeoutExpired:
        logger.error("Data load timed out after 10 minutes")
        return False
    except Exception as e:
        logger.error(f"Error running data loader: {str(e)}")
        return False


def run_scheduler(interval_minutes):
    """Run the scheduler with the specified interval"""
    global running
    
    # Register signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    logger.info("=" * 60)
    logger.info("NETRA News Data Scheduler Started")
    logger.info(f"Interval: Every {interval_minutes} minutes")
    logger.info(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)
    
    # Run immediately on start
    logger.info("Running initial data load...")
    run_data_loader()
    
    # Calculate interval in seconds
    interval_seconds = interval_minutes * 60
    last_run = time.time()
    
    logger.info(f"\nNext run scheduled in {interval_minutes} minutes...")
    logger.info("Press Ctrl+C to stop the scheduler.\n")
    
    while running:
        try:
            current_time = time.time()
            
            # Check if it's time to run again
            if current_time - last_run >= interval_seconds:
                run_data_loader()
                last_run = current_time
                if running:
                    logger.info(f"\nNext run scheduled in {interval_minutes} minutes...")
            
            # Sleep for a short interval to check for shutdown signals
            time.sleep(10)
            
        except Exception as e:
            logger.error(f"Scheduler error: {str(e)}")
            time.sleep(60)  # Wait a minute before retrying
    
    logger.info("Scheduler stopped gracefully.")


def run_with_schedule_library(interval_minutes):
    """Alternative implementation using the 'schedule' library"""
    try:
        import schedule
    except ImportError:
        logger.error("'schedule' library not installed. Install with: pip install schedule")
        logger.info("Falling back to simple scheduler...")
        run_scheduler(interval_minutes)
        return
    
    global running
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    logger.info("=" * 60)
    logger.info("NETRA News Data Scheduler Started (using schedule library)")
    logger.info(f"Interval: Every {interval_minutes} minutes")
    logger.info(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)
    
    # Schedule the job
    schedule.every(interval_minutes).minutes.do(run_data_loader)
    
    # Run immediately on start
    logger.info("Running initial data load...")
    run_data_loader()
    
    logger.info(f"\nNext run scheduled in {interval_minutes} minutes...")
    logger.info("Press Ctrl+C to stop the scheduler.\n")
    
    while running:
        schedule.run_pending()
        time.sleep(10)
    
    logger.info("Scheduler stopped gracefully.")


def main():
    parser = argparse.ArgumentParser(
        description='NETRA News Data Scheduler - Periodically loads new articles into the database'
    )
    parser.add_argument(
        '--interval', '-i',
        type=int,
        default=60,
        help='Interval in minutes between data loads (default: 60)'
    )
    parser.add_argument(
        '--once', '-o',
        action='store_true',
        help='Run the data loader once and exit'
    )
    parser.add_argument(
        '--use-schedule',
        action='store_true',
        help='Use the schedule library (requires: pip install schedule)'
    )
    
    args = parser.parse_args()
    
    # Validate interval
    if args.interval < 1:
        logger.error("Interval must be at least 1 minute")
        sys.exit(1)
    
    if args.interval > 1440:
        logger.warning("Interval is greater than 24 hours. Are you sure?")
    
    # Run once mode
    if args.once:
        logger.info("Running in single-run mode...")
        success = run_data_loader()
        sys.exit(0 if success else 1)
    
    # Scheduler mode
    if args.use_schedule:
        run_with_schedule_library(args.interval)
    else:
        run_scheduler(args.interval)


if __name__ == '__main__':
    main()