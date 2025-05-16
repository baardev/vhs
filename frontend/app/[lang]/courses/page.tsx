export default function CoursesPage({ params }: { params: { lang: string } }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Courses Page ({params.lang.toUpperCase()})</h1>
      <p>This is a placeholder page for courses.</p>
      <p>Content will be added soon.</p>
    </div>
  );
} 