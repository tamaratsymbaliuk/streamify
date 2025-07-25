import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components';
import * as React from 'react';

interface EnableTwoFactorTemplateProps {
	domain: string
}

export function EnableTwoFactorTemplate({ domain }: EnableTwoFactorTemplateProps) {
	const settingsLink = `${domain}/dashboard/settings`

	return (
		<Html>
		    <Head />
	        <Preview>Secure your account</Preview>
	        <Tailwind>
		        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Protect your account with two-factor authentication
						</Heading>
						<Text className="text-black text-base mt-2">
							Enable two-factor authentication to enhance the security of your account.
						</Text>
					</Section>

					<Section className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
						<Heading className="text-2xl text-black font-semibold">
							Why is this important?
						</Heading>
						<Text className="text-base text-black mt-2">
							The two-factor authentication adds an extra layer of protection by requiring a code that only you know.
						</Text>
						<Link
							href={settingsLink}
							className="inline-flex justify-center items-center text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
						>
							Go to account settings
						</Link>
					</Section>

					<Section className="text-center mt-8">
						<Text className="text-gray-600">
							If you have any questions, feel free to contact our support team at{' '}
							<Link
								href="mailto:help@streamify.com"
								className="text-[#18b9ae] underline"
							>
								help@streamify.com
							</Link>.
						</Text>
					</Section>
		        </Body>
	        </Tailwind>
        </Html>
	)
}