import React, {useState} from "react";

import {AppBar,Toolbar,Typography,Box,Button,IconButton,Drawer,List,ListItem,ListItemText} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        {label: 'India', path: '/india'},
        {label: 'World', path: '/world'},
        {label: 'Local', path: '/local'},
        {label: 'Sports',path: '/local'},
        {label: 'Business', path: '/business'},
        {label: 'Science', path: '/science'},
        {label: 'Technology', path: '/technology'},
        {label: 'Entertainment', path: '/entertainment'}
    ];
React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

    return(
        <>
            <AppBar position="static" sx={{backgroundColor: '#ffffff',color: '#000000',boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                <Toolbar sx={{justifyContent:'space-between',px:{xs: 2, md: 4}}}>
                    {/*Logo */}
                    <Typography variant="h6" sx={{fontWeight:'bold',color:'#080808ff',textDecoration:'none'}}>
                        NETRA
                    </Typography>

                    {/*Desktop Navigation */}
                    <Box sx={{display:{xs: 'none', md:'flex'},gap: 2,justifyContent:'center',flex:1}}>
                        {navItems.map((item)=>(
                            <Button key={item.path} sx={{color:'#333333',textTransform:'none',fontSize:'0.95rem',fontWeight: 500, '&:hover':{backgroundColor: 'rgba(25,118,210,0.08'},}}>
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                        {/*Mobile Menu Button */}
                        <IconButton sx={{display:{xs:'block',md:'none'}}} onClick={()=>setMobileMenuOpen(true)}>
                            <MenuIcon/>
                        </IconButton>
                </Toolbar>
            </AppBar>

            {/*Mobile Drawer Menu */}
            <Drawer anchor="right" open={mobileMenuOpen} onClose={()=>setMobileMenuOpen(false)}>
                <Box sx={{width:250,p:2}}>
                    <Box sx={{display:'flex',justifyContent:'flex-end',mb:2}}>
                        <IconButton onClick={()=>setMobileMenuOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {navItems.map((item)=>(
                            <ListItem key={item.path}
                            button
                            onClick={()=>setMobileMenuOpen(false)}
                            sx={{'&:hover':{
                                backgroundColor: 'rgba(25,118,210,0.08)',
                            },}}>
                            <ListItemText primary={item.label} sx={{'& .MuiTypography-root':{fontWeight: 500}}}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default Navbar;