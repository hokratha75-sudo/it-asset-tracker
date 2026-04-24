import { NextResponse } from 'next/server';

export async function GET() {
  const baseId = 'appz5V4zSvlwElQeO'; // Base ID របស់អ្នក
  const tableName = 'Assets';
  const token = process.env.AIRTABLE_ACCESS_TOKEN; 

  if (!token) return NextResponse.json({ error: 'Missing Token' }, { status: 500 });

  try {
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store' 
    });
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    const data = await response.json();
    return NextResponse.json(data.records);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}