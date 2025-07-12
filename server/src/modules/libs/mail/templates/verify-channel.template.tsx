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

export function VerifyChannelTemplate() {
	return (
		<Html>
		    <Head />
	        <Preview>channel is verified</Preview>
	        <Tailwind>
		        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Congratulations! Your channel is verified
						</Heading>
						<Text className="text-black text-base mt-2">
							We’re happy to inform you that your channel is now verified and has received the official badge.
						</Text>
					</Section>

					<Section className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
						<Heading className="text-2xl text-black font-semibold">
							What does this mean?
						</Heading>
						<Text className="text-base text-black mt-2">
							The verification badge confirms the authenticity of your channel and increases viewer trust.
						</Text>
					</Section>

					<Section className="text-center mt-8">
						<Text className="text-gray-600">
							If you have any questions, write to us at{' '}
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