import { CareerRole, CareerPath, GuidanceData } from '@/types';

const API_BASE = '/api/career';

export async function fetchRoles(field: string): Promise<{ roles: CareerRole[] }> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'roles', field })
    });

    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
}

export async function fetchPaths(role: string, field: string): Promise<{ paths: CareerPath[] }> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'paths', role, field })
    });

    if (!res.ok) throw new Error('Failed to fetch paths');
    return res.json();
}

export async function fetchGuidance(
    role: string,
    field: string,
    experience: string
): Promise<GuidanceData> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'guidance', role, field, experience })
    });

    if (!res.ok) throw new Error('Failed to fetch guidance');
    return res.json();
}