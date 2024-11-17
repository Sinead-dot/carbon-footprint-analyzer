import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, Server, Image, Code, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CarbonFootprintAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeWebsite = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://your-api-url/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate recommendations based on analysis
  const getRecommendations = () => {
    if (!analysis) return [];
    
    const recommendations = [];
    
    if (analysis.metrics.imagesSize > 1) {
      recommendations.push({
        title: 'Optimize Images',
        description: 'Large images contribute significantly to your carbon footprint. Consider:',
        details: [
          'Compress images using modern formats like WebP',
          'Implement lazy loading for images below the fold',
          'Use responsive images for different screen sizes'
        ],
        icon: Image,
        impact: 'high'
      });
    }

    if (analysis.metrics.jsSize > 0.5) {
      recommendations.push({
        title: 'Optimize JavaScript',
        description: 'Reduce JavaScript payload to improve efficiency:',
        details: [
          'Implement code splitting',
          'Remove unused code through tree shaking',
          'Minimize and compress JavaScript files'
        ],
        icon: Code,
        impact: 'medium'
      });
    }

    if (analysis.metrics.caching === 'Poor') {
      recommendations.push({
        title: 'Implement Caching',
        description: 'Proper caching can significantly reduce server load:',
        details: [
          'Set appropriate cache headers',
          'Implement browser caching',
          'Use service workers for offline functionality'
        ],
        icon: Database,
        impact: 'high'
      });
    }

    if (!analysis.metrics.cdnUsage) {
      recommendations.push({
        title: 'Use a CDN',
        description: 'Content Delivery Networks reduce server load and transmission distance:',
        details: [
          'Implement a CDN for static assets',
          'Choose green CDN providers',
          'Enable CDN caching'
        ],
        icon: Server,
        impact: 'medium'
      });
    }

    return recommendations;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Website Carbon Footprint Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter website URL"
              className="flex-1 p-2 border rounded"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={analyzeWebsite}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Carbon Footprint Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">
                {analysis.total_co2} g CO2/pageview
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Total Page Size</p>
                  <p className="font-semibold">{analysis.metrics.pageSize} MB</p>
                </div>
                <div>
                  <p className="text-gray-600">Images Size</p>
                  <p className="font-semibold">{analysis.metrics.imagesSize} MB</p>
                </div>
                <div>
                  <p className="text-gray-600">JavaScript Size</p>
                  <p className="font-semibold">{analysis.metrics.jsSize} MB</p>
                </div>
                <div>
                  <p className="text-gray-600">Server Location</p>
                  <p className="font-semibold">{analysis.metrics.serverLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Recommendations</h2>
            {getRecommendations().map((rec, index) => (
              <Alert key={index} variant={rec.impact === 'high' ? 'destructive' : 'default'}>
                <rec.icon className="h-4 w-4" />
                <AlertTitle>{rec.title}</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">{rec.description}</p>
                  <ul className="list-disc pl-6">
                    {rec.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarbonFootprintAnalyzer;
