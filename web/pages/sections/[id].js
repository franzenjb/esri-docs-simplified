import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { marked } from 'marked';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function Section() {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id]);

  const loadContent = async () => {
    try {
      const response = await fetch('/content/content.json');
      if (response.ok) {
        const data = await response.json();
        const section = data.structure?.sections?.find(s => s.id === id);
        setContent(section);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Section not found</h2>
          <Link href="/">
            <a className="text-esri-blue hover:text-esri-darkBlue">
              Return to home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{content.title} - Esri Docs Simplified</title>
      </Head>

      <div className="max-w-4xl mx-auto p-8">
        <Link href="/">
          <a className="inline-flex items-center text-esri-blue hover:text-esri-darkBlue mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </a>
        </Link>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">{content.icon}</span>
            <h1 className="text-4xl font-bold text-gray-900">{content.title}</h1>
          </div>
          <p className="text-xl text-gray-600">{content.description}</p>
        </div>

        <div className="space-y-8">
          {content.content?.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{
                  __html: marked(item.content || 'Content loading...')
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <ExternalLink className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-medium text-blue-900">Reference</p>
              <a
                href="https://community.esri.com/t5/esri-training-documents/arcgis-experience-builder-advanced-techniques/ta-p/1651520"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View original Esri documentation →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}