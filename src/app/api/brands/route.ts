import { NextResponse } from 'next/server';

const FIRESTORE_URL =
  'https://firestore.googleapis.com/v1/projects/irunica-brand/databases/(default)/documents/brands?pageSize=100';

interface FirestoreDocument {
  name: string;
  fields: {
    name?: { stringValue: string };
    imageUrl?: { stringValue: string };
    description?: { stringValue: string };
    createdAt?: { stringValue: string };
  };
}

interface Brand {
  name: string;
  imageUrl: string;
  description: string;
}

export async function GET() {
  try {
    const res = await fetch(FIRESTORE_URL, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Firestore responded with ${res.status}`);
    }

    const data = await res.json();
    const documents: FirestoreDocument[] = data.documents ?? [];

    const brands: Brand[] = documents
      .map((doc) => ({
        name: doc.fields?.name?.stringValue ?? '',
        imageUrl: doc.fields?.imageUrl?.stringValue ?? '',
        description: doc.fields?.description?.stringValue ?? '',
        createdAt: doc.fields?.createdAt?.stringValue ?? '',
      }))
      .filter((b) => b.name && b.imageUrl)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ createdAt, ...rest }) => rest);

    return NextResponse.json(brands, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
