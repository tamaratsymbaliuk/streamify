import type { SessionMetadata } from '@/shared/types/session-metadata.types'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface DeactivateTemplateProps {
	token: string
	metadata: SessionMetadata
}

export function DeactivateTemplate({ token, metadata }: DeactivateTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Account Deactivation</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>
							Account Deactivation Request
						</Heading>
						<Text className="text-black text-base mt-2">
							ou have initiated the process of deactivating your account on the <b>Streamify</b> platform.
						</Text>
					</Section>

					<Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
						<Heading className='text-2xl text-black font-semibold'>
							Confirmation code:
						</Heading>
						<Heading className='text-3xl text-black font-semibold'>
							{token}
						</Heading>
						<Text className='text-black'>
							This code is valid for 5 minutes.
						</Text>
					</Section>

					<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
						<Heading 
							className='text-xl font-semibold text-[#18B9AE]'
						>
							Request Information:
						</Heading>
						<ul className="list-disc list-inside text-black mt-2">
							<li>🌍 Location {metadata.location.country}, {metadata.location.city}</li>
							<li>📱 Operating System: {metadata.device.os}</li>
							<li>🌐 Browser: {metadata.device.browser}</li>
							<li>💻 IP Address: {metadata.ip}</li>
						</ul>
						<Text className='text-gray-600 mt-2'>
							If you did not initiate this request, please ignore this message.
						</Text>
					</Section>

					<Section className='text-center mt-8'>
						<Text className='text-gray-600'>
							If you have any questions or encounter any difficulties, please feel free to contact our support team at{' '}
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