import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  NumberInput,
  NumberInputField,
  VStack,
} from '@chakra-ui/react';

const CreateLeadForm = () => {
  return (
    <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Lead Name</FormLabel>
          <Input placeholder="John Doe" />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="john@example.com" />
        </FormControl>

        <FormControl>
          <FormLabel>Phone</FormLabel>
          <Input placeholder="(555) 123-4567" />
        </FormControl>

        <FormControl>
          <FormLabel>Lead Source</FormLabel>
          <Select>
            <option value="zillow">Zillow</option>
            <option value="realtor">Realtor.com</option>
            <option value="referral">Referral</option>
            <option value="social">Social Media</option>
            <option value="direct">Direct Contact</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Property Interest</FormLabel>
          <Select>
            <option value="buying">Looking to Buy</option>
            <option value="selling">Looking to Sell</option>
            <option value="both">Both</option>
            <option value="investing">Investment Property</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Budget Range</FormLabel>
          <Stack direction="row" spacing={4}>
            <NumberInput min={0}>
              <NumberInputField placeholder="Min" />
            </NumberInput>
            <NumberInput min={0}>
              <NumberInputField placeholder="Max" />
            </NumberInput>
          </Stack>
        </FormControl>

        <FormControl>
          <FormLabel>Preferred Location</FormLabel>
          <Input placeholder="City, State or Area" />
        </FormControl>

        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea placeholder="Additional details about the lead..." />
        </FormControl>

        <Button
          colorScheme="blue"
          size="lg"
          width="full"
        >
          Create Lead
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateLeadForm;
