import { CheckIcon, ColorSwatch, Group } from '@mantine/core'
import React from 'react'
import { ColorOption, colorOptions, useTheme } from '../../Theme'

export interface ColorSchemePickerProps {
  primaryColorOption: ColorOption
  setPrimaryColor: (color: ColorOption) => void
}

const ColorSchemePicker: React.FC<ColorSchemePickerProps> = ({
  primaryColorOption,
  setPrimaryColor,
}) => {
  const { colors } = useTheme()

  return (
    <Group spacing="xs">
      {colorOptions.map(c => (
        <ColorSwatch
          key={c}
          aria-label={`change theme to ${c}`}
          component="button"
          color={colors[c][8]}
          onClick={() => setPrimaryColor(c)}
          sx={{ color: '#fff', cursor: 'pointer' }}
        >
          {primaryColorOption === c && (
            <CheckIcon data-testid="primary-color-check" width={10} />
          )}
        </ColorSwatch>
      ))}
    </Group>
  )
}

export default ColorSchemePicker
