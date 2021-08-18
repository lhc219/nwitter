import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async () => {
            const ok = window.confirm("Are you sure you want to delete this nweet?");
            if(ok){
                await dbService.doc(`nweets/${nweetObj.id}`).delete();
                if(nweetObj.attachmentUrl !=="") {
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
                }
            } 
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: {value},
            } = event;
        setNewNweet(value);
    };
    
    return(
        <div className="nweet">
            {editing ? (
                    <>
                    {isOwner && (
                    <>
                    <form onSubmit={onSubmit} className="container nweetedit"> 
                        <input 
                            type="text"
                            placeholder="Edit your nweet"
                            value={newNweet}
                            autoFocus
                            onChange={onChange}
                            className="formInput"
                            required />
                        <input type="submit" value="Upadte Nweet" className="formBtn"/>
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
                    </>
                    )}
                    </>
                ) : (
                        <>
                        <h4>{nweetObj.text}</h4>
                            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="100%" />}
                            {isOwner && (
                                <div className="nweet__actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                    <span onClick={toggleEditing}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </span>
                                </div>              
                            )}
                        </>
                        )
            }
        </div>
    );
};
export default Nweet;