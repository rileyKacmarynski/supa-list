import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColorOption } from 'ui/Theme'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '__tests__/testUtils'
import ColorSchemePicker, {
	ColorSchemePickerProps,
	testIds,
} from './ColorSchemePicker'

describe('<ColorSchemePicker />', () => {
	const mountComponent = (props: Partial<ColorSchemePickerProps> = {}) => {
		const { primaryColorOption = 'grape', setPrimaryColor = vi.fn() } = props

		return renderWithProviders(
			<ColorSchemePicker
				primaryColorOption={primaryColorOption}
				setPrimaryColor={setPrimaryColor}
			/>,
		)
	}

	const getColorSwatch = (colorOption: ColorOption) => {
		return screen.getByLabelText(`change theme to ${colorOption}`)
	}

	it('shows the primaryColorOption as checked', () => {
		const primaryColorOption: ColorOption = 'cyan'
		mountComponent({ primaryColorOption })

		const colorSwatch = within(getColorSwatch(primaryColorOption))

		expect(colorSwatch.queryByTestId(testIds.CHECK_ICON)).toBeDefined()
	})

	it('sets the color option when a swatch is clicked', async () => {
		const newColorOption: ColorOption = 'indigo'
		const setPrimaryColor = vi.fn()
		mountComponent({ setPrimaryColor })

		await userEvent.click(getColorSwatch(newColorOption))

		expect(setPrimaryColor).toHaveBeenCalledWith(newColorOption)
	})
})
