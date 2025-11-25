import './DevOpsPanel.css';

function DevOpsPanel() {
  return (
    <div className="devops-panel">
      <h2>Infrastructure & DevOps</h2>
      
      <div className="devops-grid">
        <div className="devops-section">
          <h3>Compute</h3>
          <ul>
            <li><strong>Cloud Run</strong> — Serverless containers with auto-scaling</li>
            <li><strong>Backend:</strong> Node.js + Express (1 CPU, 512Mi)</li>
            <li><strong>Frontend:</strong> React 19 + Vite + Nginx</li>
            <li><strong>Multi-stage Docker</strong> builds for optimized images</li>
          </ul>
        </div>

        <div className="devops-section">
          <h3>Networking</h3>
          <ul>
            <li><strong>Global HTTPS Load Balancer</strong> with managed SSL</li>
            <li><strong>VPC Network</strong> with private subnet (10.0.0.0/20)</li>
            <li><strong>Serverless VPC Connector</strong> for private database access</li>
            <li><strong>Cloud Armor</strong> security policies</li>
          </ul>
        </div>

        <div className="devops-section">
          <h3>Data & Security</h3>
          <ul>
            <li><strong>Cloud SQL PostgreSQL 15</strong> — Private IP only</li>
            <li><strong>Secret Manager</strong> for credential storage</li>
            <li><strong>Point-in-time recovery</strong> enabled</li>
            <li><strong>Rate limiting:</strong> 100 req/min per IP</li>
          </ul>
        </div>

        <div className="devops-section">
          <h3>Infrastructure as Code</h3>
          <ul>
            <li><strong>Terraform</strong> for all GCP resources</li>
            <li><strong>Remote state</strong> in GCS with versioning</li>
            <li><strong>Modular structure</strong> by resource type</li>
            <li><strong>CI/CD ready</strong> for GitHub Actions</li>
          </ul>
        </div>
      </div>

      <div className="devops-footer">
        <p>
          <strong>Architecture:</strong> Serverless • Private Database • Zero Trust • Auto-scaling
        </p>
        <p>
          <strong>Cost:</strong> ~$32-43/month (with load balancer) • ~$10/month (direct Cloud Run URLs)
        </p>
      </div>
    </div>
  );
}

export default DevOpsPanel;

