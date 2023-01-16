import React, { useState } from "react";
import "../styles/ViewParticipantsList.css";
import Modal from "../UI/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect } from "react";
import axios from "axios";

const ViewParticipantsList = (props) => {
  const [attendants, setAttendants] = useState([]);

  useEffect(() => {
    const getAttendants = async (scheduledClassId) => {
      const tkUser = props.tkUser;
      try {
        const res = await axios.get(`/schedule/users/${scheduledClassId}`, {
          headers: {
            Authorization: `Bearer ${tkUser}`,
          },
        });

        setAttendants(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const scheduledClassId = props.scheduledClassId;
    getAttendants(scheduledClassId);
  }, [props.scheduledClassId, props.tkUser]);

  return (
    <Modal>
      <div className="participants-container">
        <div className="participants-list-title-section">
          <div className="participants-list-title">Participants List</div>
          <button
            className="close-button"
            onClick={props.closeViewParticipantsList}
          >
            <CloseRoundedIcon />
          </button>
        </div>

        <div className="participants-list-container">
          <div className="participants">
            {attendants &&
              attendants.map((attendant, index) => {
                return (
                  <div className="participant-name" key={index}>
                    {attendant.firstname} {attendant.lastname}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewParticipantsList;
