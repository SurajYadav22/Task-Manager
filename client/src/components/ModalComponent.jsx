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
import React, { useState } from "react";
import { createTask } from "../redux/task-redux/action";
import { useDispatch } from "react-redux";

function ModalComponent({ isOpen, onClose, initialRef, finalRef }) {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!data.title) newErrors.title = "Task title is required.";
    if (!data.description)
      newErrors.description = "Task description is required.";
    if (!data.dueDate) newErrors.dueDate = "Due date is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    dispatch(createTask(data))
      .then(() => {
        onClose();
      })
      .catch((error) => {
        setErrors({ api: error.response.data.message });
      });
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {errors.api && <Text color="red.500">{errors.api}</Text>}
          <FormControl isRequired>
            <FormLabel>Task Title</FormLabel>
            <Input
              ref={initialRef}
              name="title"
              onChange={handleChange}
              placeholder="Task Title"
            />
            {errors.title && <Text color="red.500">{errors.title}</Text>}
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Task Description</FormLabel>
            <Input
              name="description"
              onChange={handleChange}
              placeholder="Task Description"
            />
            {errors.description && (
              <Text color="red.500">{errors.description}</Text>
            )}
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Due Date</FormLabel>
            <Input type="date" name="dueDate" onChange={handleChange} />
            {errors.dueDate && <Text color="red.500">{errors.dueDate}</Text>}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit} mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalComponent;
