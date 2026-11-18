import React, { Suspense } from 'react';
import { initialProjects } from '../../../data/mockData';
import { ProjectDetailContent } from './ProjectDetailContent';

export function generateStaticParams() {
  return initialProjects.map((p) => ({
    id: p.id,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f5ee] dark:bg-[#050508]" />}>
      <ProjectDetailContent projectId={id} />
    </Suspense>
  );
}
