import React, {Fragment, useContext, useState} from "react";
import {StudentIDContext} from "../../UserIDProviders/StudentIDProvider";
import API from "../../API_Interface/API_Interface";
import {Button, TextField} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

export default function HelpDialog({dialogtext}){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');


    const handleDialogOpen = (scrollType) => () => {
        setDialogOpen(true);
        setScroll(scrollType);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (dialogOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dialogOpen]);

    return(<Fragment>
        <Button onClick={handleDialogOpen('body')} sx={{justifyContent: 'left'}}>Help</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">About this page</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                    style={{whiteSpace: 'pre-line'}}
                >

                    {
                        dialogtext
                    }

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}


