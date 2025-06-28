const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../posts');
const indexPath = path.join(postsDir, 'index.json');

function generatePostsIndex() {
  const files = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      filename: file,
      path: `/posts/${file}`
    }));

  const index = {
    posts: files,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`Generated posts index with ${files.length} posts`);
}

generatePostsIndex();