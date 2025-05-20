// Simulate fetching JSON data from a URL with delay and possible HTTP error
export async function simulateApiFetch<T>(url: string, delayMs = 500): Promise<T> {

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
}

// Simulate updating data with delay and very low random failure (0.5%)
export async function simulateApiUpdate<T>(data: T): Promise<T> {

    if (Math.random() < 0.005) {
        throw new Error('Failed to update data on server')
    }

    return data
}

// Simulate updating data with delay and very low random failure (0.5%)
export async function simulateApiCreate<T>(data: T): Promise<T> {

    if (Math.random() < 0.005) {
        throw new Error('Failed to create data on server')
    }

    return data
}


// Simulate deleting data by ID with delay and very low random failure (0.5%)
export async function simulateApiDelete(id: number): Promise<number> {
    if (Math.random() < 0.005) {
        throw new Error('Failed to delete data on server')
    }

    return id
}
