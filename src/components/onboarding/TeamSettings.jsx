'use client'

import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  Text,
} from '@chakra-ui/react'

export const TeamSettings = ({ data, onChange }) => {
  return (
    <Stack spacing={6}>
      <FormControl>
        <FormLabel>Team Name</FormLabel>
        <Input
          name="team_name"
          value={data?.team_name || ''}
          onChange={onChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Default Time Zone</FormLabel>
        <Select
          name="timezone"
          value={data?.timezone || ''}
          onChange={onChange}
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
        </Select>
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Enable Team Notifications
        </FormLabel>
        <Switch
          name="team_notifications"
          isChecked={data?.team_notifications}
          onChange={(e) => onChange({
            target: {
              name: 'team_notifications',
              value: e.target.checked
            }
          })}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Allow Team Members to Invite Others
        </FormLabel>
        <Switch
          name="allow_invites"
          isChecked={data?.allow_invites}
          onChange={(e) => onChange({
            target: {
              name: 'allow_invites',
              value: e.target.checked
            }
          })}
        />
      </FormControl>
    </Stack>
  )
}
