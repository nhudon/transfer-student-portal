import React, {Fragment, useState} from "react";
import {Button} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

function SaveButton({postFunction, showDialog}){
    const [submit, setSubmit] = useState(false);
    const onClickHandler = () => {
        postFunction();
        setSubmit(!submit);
    }
    return(<Fragment>
        <Button onClick={onClickHandler}>Save Rankings</Button>

    </Fragment>

)
    // { submit && <ConfirmationDialog postFunction={postFunction}/> }
}
function ConfirmationDialog({postFunction}){
    const [dialogOpen, setDialogOpen] = React.useState(true);
    const [scroll, setScroll] = React.useState('paper');
    console.log(`ConfirmationDialog is called`);
    const handleDialogOpen = (scrollType) => () => {
        setDialogOpen(true);
        setScroll(scrollType);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleConfirm = () => {
        postFunction();
        handleDialogClose();
    }


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
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Confirm your submission</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <p>Are you sure you'd like to submit this information? </p>
                    <p>Once confirmed, you will not be able to return to this page.</p>
                    <p>You will still be able to change your course rankings but you will need to request
                    permission from your advisor to provide additional course information and matchings.</p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}

export {SaveButton, ConfirmationDialog};