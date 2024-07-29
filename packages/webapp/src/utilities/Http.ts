export async function http(url: string, options?: RequestInit) {
	const res = await fetch(url, options)
	if (res.ok) {
		return await res.json()
	} else {
		throw new Error(res.statusText)
	}
}
