import React, { useEffect } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, singleTaskFetch } from "../redux/task-redux/action";

const ViewModal = ({ id, isOpen, onClose, initialRef, finalRef }) => {
  const dispatch = useDispatch();
  const { singleTask } = useSelector((state) => state.task);

  useEffect(() => {
    if (id) {
      dispatch(singleTaskFetch(id));
    }
  }, [dispatch, id]);

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Task Title</FormLabel>
              <Input
                ref={initialRef}
                name="title"
                value={
                  singleTask?.task?.length > 0 ? singleTask?.task[0]?.title : ""
                }
                placeholder="Task Title"
                readOnly
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Task Description</FormLabel>
              <Input
                name="description"
                placeholder="Task Description"
                value={
                  singleTask?.task?.length > 0
                    ? singleTask?.task[0]?.description
                    : ""
                }
                readOnly
              />
            </FormControl>

            <Text color="gray" fontSize="xs" mt={4}>
              Created at:{" "}
              {singleTask?.task?.length > 0
                ? new Date(singleTask?.task[0]?.createdAt).toLocaleString()
                : ""}
            </Text>

            {singleTask?.task?.length > 0 && singleTask?.task[0]?.dueDate ? (
              <Text color="gray" fontSize="xs" mt={4}>
                Due date:{" "}
                {new Date(singleTask?.task[0]?.dueDate)?.toLocaleString()}
              </Text>
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewModal;
