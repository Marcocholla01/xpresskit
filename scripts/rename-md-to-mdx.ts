import fs from 'fs';
import path from 'path';

/**
 * Recursively rename all `.md` files in a directory to `.mdx`
 * @param dir The base directory to start from
 */
function renameMdToMdx(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      renameMdToMdx(fullPath); // Recursive
    } else if (entry.isFile() && fullPath.endsWith('.mdx')) {
      const mdxPath = fullPath.replace(/\.mdx$/, '.md');
      fs.renameSync(fullPath, mdxPath);
      console.log(`Renamed: ${fullPath} → ${mdxPath}`);
    }
  }
}

renameMdToMdx(path.resolve('docs'));
