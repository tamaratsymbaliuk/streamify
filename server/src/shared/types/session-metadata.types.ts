export interface LocationInfo {
	country: string
	city: string
	latidute: number
	longitude: number
}

export interface DeviceInfo {
	browser: string
	os: string
	type: string
}

export interface SessionMetadata { // Hierarchical Structure where SessionMetadata is the parent type
	location: LocationInfo
	device: DeviceInfo
	ip: string
}