import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import pick from 'lodash/pick'
import '@testing-library/jest-dom';
import NavigationComponent, { NavigationComponentProps } from './navigationComponent';
import StationMetadata from '../../lib/data/test/StationMetadata.json';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

window.HTMLElement.prototype.scrollIntoView = function () { };

const mockProps: NavigationComponentProps = {
    title: 'Test Title',
    locale: 'en',
    stationMetadata: StationMetadata,
    defaultCity: 'Tampere',
    destinationParam: undefined,
    typeParam: 'departure',
    isCommuter: false,
};

global.ResizeObserver = ResizeObserver;

jest.mock('next/navigation', () => ({
    usePathname: () => '/',
    useRouter: () => ({
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        push: jest.fn(),
        prefetch: jest.fn(),
        replace: jest.fn()
    }),
    useParams: () => ({ locale: 'en' }),
    useSelectedLayoutSegment: () => ({ locale: 'en' })
}));

describe('NavigationComponent', () => {
    it('renders the component with a title', () => {
        render(
            <NextIntlClientProvider
                locale="en"
                messages={pick(messages, ['TimeTable', 'Navigation'])}
            >
                <NavigationComponent {...mockProps} />
            </NextIntlClientProvider>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders the location and destination buttons', () => {
        render(
            <NextIntlClientProvider
                locale="en"
                messages={pick(messages, ['TimeTable', 'Navigation'])}
            >
                <NavigationComponent {...mockProps} />
            </NextIntlClientProvider>
        );
        const departureButton = screen.getByTestId('select-departure-station-button');
        const destinationButton = screen.getByTestId('select-destination-station-button');
        expect(departureButton).toBeInTheDocument();
        expect(destinationButton).toBeInTheDocument();
    });

    it('renders all the listed stations for a combobox', () => {
        render(
            <NextIntlClientProvider
                locale="en"
                messages={pick(messages, ['TimeTable', 'Navigation'])}
            >
                <NavigationComponent {...mockProps} />
            </NextIntlClientProvider>
        );
        const departureButton = screen.getByTestId('select-departure-station-button');
        fireEvent.click(departureButton);
        const comboboxItems = screen.getAllByRole('option');
        expect(comboboxItems.length).toBe(StationMetadata.length);
    });

    it('renders the swap button and expects it to be disabled by default', () => {
        render(
            <NextIntlClientProvider
                locale="en"
                messages={pick(messages, ['TimeTable', 'Navigation'])}
            >
                <NavigationComponent {...mockProps} />
            </NextIntlClientProvider>
        );
        const swapButton = screen.getByTestId('swap-stations-button');
        expect(swapButton).toBeInTheDocument();
        expect(swapButton).toBeDisabled();
    });

    it('sets the departure to Tampere and destination to Helsinki and it then swaps their place', () => {
        render(
            <NextIntlClientProvider
                locale="en"
                messages={pick(messages, ['TimeTable', 'Navigation'])}
            >
                <NavigationComponent {...mockProps} />
            </NextIntlClientProvider>
        );
        const departureButton = screen.getByTestId('select-departure-station-button');
        fireEvent.click(departureButton);
        const departureOptions = screen.getAllByRole('option');
        const tampereOption = departureOptions.find(option => option.textContent === 'Tampere');
        if (!tampereOption) {
            throw new Error('Tampere option not found');
        }
        fireEvent.click(tampereOption);

        const destinationButton = screen.getByTestId('select-destination-station-button');
        fireEvent.click(destinationButton);
        const destinationOptions = screen.getAllByRole('option');
        const helsinkiOption = destinationOptions.find(option => option.textContent === 'Helsinki');
        if (!helsinkiOption) {
            throw new Error('Helsinki option not found');
        }
        fireEvent.click(helsinkiOption);

        const swapButton = screen.getByTestId('swap-stations-button');
        fireEvent.click(swapButton);

        // NOTE: Values are expected to be swapped after having pressed the swap button.
        expect(departureButton).toHaveTextContent('Helsinki');
        expect(destinationButton).toHaveTextContent('Tampere');
    });
});
