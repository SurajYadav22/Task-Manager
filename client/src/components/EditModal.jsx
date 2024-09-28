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
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { singleTaskFetch, updateTask } from "../redux/task-redux/action";
import { useDispatch, useSelector } from "react-redux";

function EditModal({ id, isOpen, onClose, initialRef, finalRef }) {
  const dispatch = useDispatch();
  const [data, setData] = useState({ title: "", description: "", dueDate: "" });
  const [errors, setErrors] = useState({});
  const { singleTask } = useSelector((state) => state.task);
  const toast = useToast();

  useEffect(() => {
    if (id) {
      dispatch(singleTaskFetch(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (singleTask?.task?.length > 0) {
      setData({
        title: singleTask?.task[0]?.title || "",
        description: singleTask?.task[0]?.description || "",
        dueDate: singleTask?.task[0]?.dueDate
          ? new Date(singleTask?.task[0]?.dueDate).toISOString().slice(0, 10)
          : "",
      });
    }
  }, [singleTask]);

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

    dispatch(updateTask(id, data))
      .then(() => {
        toast({
          description: "Task updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        onClose();
      })
      .catch((err) => {
        toast({
          description: err.message || "Error updating the task",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
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
        <ModalHeader>Edit Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={errors.title}>
            <FormLabel>Task Title</FormLabel>
            <Input
              ref={initialRef}
              name="title"
              value={data.title || ""}
              onChange={handleChange}
              placeholder="Task Title"
            />
            {errors.title && <Text color="red.500">{errors.title}</Text>}
          </FormControl>

          <FormControl mt={4} isInvalid={errors.description}>
            <FormLabel>Task Description</FormLabel>
            <Input
              name="description"
              value={data.description || ""}
              onChange={handleChange}
              placeholder="Task Description"
            />
            {errors.description && (
              <Text color="red.500">{errors.description}</Text>
            )}
          </FormControl>

          <FormControl mt={4} isInvalid={errors.dueDate}>
            <FormLabel>Due Date</FormLabel>
            <Input
              type="date"
              name="dueDate"
              value={data.dueDate || ""}
              onChange={handleChange}
              placeholder="Select Due Date"
            />
            {errors.dueDate && <Text color="red.500">{errors.dueDate}</Text>}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            type="submit"
            onClick={handleSubmit}
            mr={3}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditModal;
