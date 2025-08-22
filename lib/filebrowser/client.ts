// Filebrowser API client for RollThePay
// Based on the Filebrowser API documentation and server logs

// Cache configuration
const CACHE_DURATION = 31536000 * 1000; // 1 year in milliseconds
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Build-time bypass - prevent Filebrowser calls during build
// Only bypass during actual build phases, not during runtime
const isBuildTime = process.env.NODE_ENV === 'production' && 
                   (process.env.NEXT_PHASE === 'phase-production-build' || 
                    process.env.NEXT_PHASE === 'phase-production-optimize' ||
                    process.env.NEXT_PHASE === 'phase-production-compile');

// Debug build-time detection
if (typeof process !== 'undefined' && process.env) {
  console.log('🔍 Build-time detection:');
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  NEXT_PHASE: ${process.env.NEXT_PHASE || 'NOT SET'}`);
  console.log(`  isBuildTime: ${isBuildTime}`);
  console.log(`  Current timestamp: ${Date.now()}`);
}

// Filebrowser configuration
const FILEBROWSER_BASE_URL = process.env.FILEBROWSER_BASE_URL;
const FILEBROWSER_API_KEY = process.env.FILEBROWSER_API_KEY;
const SOURCE_NAME = 'folder'; // Based on server logs
const ENTRY_FOLDER = '/rollthepay'; // Based on server logs

// Debug environment variable loading
if (typeof process !== 'undefined' && process.env) {
  console.log('🔍 Environment variables check:');
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  NEXT_PHASE: ${process.env.NEXT_PHASE || 'NOT SET'}`);
  console.log(`  FILEBROWSER_BASE_URL: ${process.env.FILEBROWSER_BASE_URL || 'NOT SET'}`);
  console.log(`  FILEBROWSER_API_KEY: ${process.env.FILEBROWSER_API_KEY ? 'SET (length: ' + process.env.FILEBROWSER_API_KEY.length + ')' : 'NOT SET'}`);
  console.log(`  Current working directory: ${process.cwd()}`);
}

// Validate environment variables
function validateConfig() {
  console.log('🔧 Validating Filebrowser configuration...');
  console.log(`  FILEBROWSER_BASE_URL: ${FILEBROWSER_BASE_URL ? 'SET' : 'MISSING'}`);
  console.log(`  FILEBROWSER_API_KEY: ${FILEBROWSER_API_KEY ? 'SET' : 'MISSING'}`);
  
  if (!FILEBROWSER_BASE_URL) {
    throw new Error('FILEBROWSER_BASE_URL is required. Please set this environment variable.');
  }
  if (!FILEBROWSER_API_KEY) {
    throw new Error('FILEBROWSER_API_KEY is required. Please set this environment variable.');
  }
  
  console.log('✅ Filebrowser configuration validated successfully');
}

// Cache management functions
function getCachedData<T>(key: string): T | null {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    memoryCache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

function setCachedData<T>(key: string, data: T, ttl: number = CACHE_DURATION): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

function clearCache(): void {
  memoryCache.clear();
}

// Helper function to encode path for URL
function encodePath(path: string): string {
  return encodeURIComponent(path);
}

// Helper function to normalize path
function normalizePath(path: string): string {
  // Remove leading slash if present and ensure proper format
  return path.startsWith('/') ? path : `/${path}`;
}

// Get resource information from Filebrowser
async function getResource(path: string, includeContent: boolean = false): Promise<any> {
  const normalizedPath = normalizePath(path);
  const encodedPath = encodePath(normalizedPath);
  
  const url = `${FILEBROWSER_BASE_URL}/api/resources?path=${encodedPath}&source=${SOURCE_NAME}${includeContent ? '&content=true' : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${FILEBROWSER_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Filebrowser API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Get raw file content from Filebrowser
async function getRawContent(path: string): Promise<string> {
  const normalizedPath = normalizePath(path);
  const encodedPath = encodePath(normalizedPath);
  
  const url = `${FILEBROWSER_BASE_URL}/api/raw?files=${SOURCE_NAME}::${encodedPath}&inline=true`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${FILEBROWSER_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Filebrowser raw API error: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

// List contents of a directory
async function listDirectory(path: string): Promise<string[]> {
  try {
    const resource = await getResource(path, false);
    
    if (resource.type !== 'directory') {
      throw new Error(`Path ${path} is not a directory`);
    }

    const csvFiles: string[] = [];
    
    // Check files in directory
    if (resource.files) {
      for (const file of resource.files) {
        if (file.name.endsWith('.csv')) {
          csvFiles.push(file.name);
        }
      }
    }

    // Check subdirectories recursively
    if (resource.folders) {
      for (const folder of resource.folders) {
        const subPath = `${path}/${folder.name}`;
        const subFiles = await listDirectory(subPath);
        csvFiles.push(...subFiles.map(file => `${folder.name}/${file}`));
      }
    }

    return csvFiles;
  } catch (error) {
    console.error(`Failed to list directory ${path}:`, error);
    return [];
  }
}

// Get all CSV files from the rollthepay folder
export async function getAllCsvFiles(): Promise<string[]> {
  console.log('🔍 getAllCsvFiles() called at:', new Date().toISOString());
  console.log('🔍 Build-time detection in client:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  NEXT_PHASE:', process.env.NEXT_PHASE || 'NOT SET');
  console.log('  isBuildTime:', isBuildTime);
  
  // Return empty list during build to prevent API calls
  if (isBuildTime) {
    console.log('🚫 Build-time bypass: returning empty CSV file list');
    return [];
  }

  console.log('✅ Not in build time - proceeding with Filebrowser API calls');
  
  const cacheKey = 'all-csv-files';
  
  // Check cache first
  const cached = getCachedData<string[]>(cacheKey);
  if (cached) {
    console.log('Cache hit for all CSV files list');
    return cached;
  }

  try {
    validateConfig();
    
    console.log('🔍 Discovering all CSV files from rollthepay folder...');
    
    const csvFiles = await listDirectory(ENTRY_FOLDER);
    
    // Cache the result for 1 year
    setCachedData(cacheKey, csvFiles, CACHE_DURATION);
    console.log(`🎯 Total CSV files discovered: ${csvFiles.length}`);
    console.log(`💾 CSV files list cached for 1 year`);
    
    return csvFiles;
  } catch (error) {
    console.error('Failed to discover CSV files:', error);
    throw new Error(`Failed to discover CSV files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get object (file content) from Filebrowser
export async function getObject(objectName: string): Promise<string> {
  console.log('🔍 getObject() called for:', objectName, 'at:', new Date().toISOString());
  console.log('🔍 Build-time detection in getObject:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  NEXT_PHASE:', process.env.NEXT_PHASE || 'NOT SET');
  console.log('  isBuildTime:', isBuildTime);
  
  // Return empty data during build to prevent API calls
  if (isBuildTime) {
    console.log(`🚫 Build-time bypass: returning empty data for ${objectName}`);
    return '';
  }

  console.log('✅ Not in build time - proceeding with Filebrowser API calls');
  
  const cacheKey = `object:${objectName}`;
  
  // Check cache first
  const cached = getCachedData<string>(cacheKey);
  if (cached) {
    console.log(`Cache hit for ${objectName}`);
    return cached;
  }
  
  try {
    validateConfig();
    
    console.log(`Cache miss for ${objectName}, fetching from Filebrowser...`);
    
    const fullPath = `${ENTRY_FOLDER}/${objectName}`;
    const content = await getRawContent(fullPath);
    
    // Cache the result for 1 year
    setCachedData(cacheKey, content, CACHE_DURATION);
    console.log(`Cached ${objectName} for 1 year`);
    
    return content;
  } catch (error) {
    console.error(`Failed to get object ${objectName}:`, error);
    throw new Error(`Failed to retrieve file ${objectName} from Filebrowser: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// List objects in a directory with caching
export async function listObjects(prefix: string = '', recursive: boolean = true): Promise<string[]> {
  // Return empty list during build to prevent API calls
  if (isBuildTime) {
    if (!isBuildTime) console.log(`Build-time bypass: returning empty list for ${prefix}`);
    return [];
  }

  const cacheKey = `list:${prefix}:${recursive}`;
  
  // Check cache first
  const cached = getCachedData<string[]>(cacheKey);
  if (cached) {
    console.log(`Cache hit for object list ${prefix}`);
    return cached;
  }
  
  try {
    console.log(`Cache miss for object list ${prefix}, fetching from Filebrowser...`);
    
    const fullPath = prefix ? `${ENTRY_FOLDER}/${prefix}` : ENTRY_FOLDER;
    const csvFiles = await listDirectory(fullPath);
    
    // Filter by prefix if specified
    const filteredFiles = prefix 
      ? csvFiles.filter(file => file.startsWith(prefix))
      : csvFiles;
    
    // Cache the result for 1 year
    setCachedData(cacheKey, filteredFiles, CACHE_DURATION);
    console.log(`Cached object list ${prefix} for 1 year`);
    
    return filteredFiles;
  } catch (error) {
    console.error(`Failed to list objects with prefix ${prefix}:`, error);
    throw new Error(`Failed to retrieve file list from Filebrowser: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Check if object exists with caching
export async function objectExists(objectName: string): Promise<boolean> {
  // Return false during build to prevent API calls
  if (isBuildTime) {
    if (!isBuildTime) console.log(`Build-time bypass: returning false for ${objectName}`);
    return false;
  }

  const cacheKey = `exists:${objectName}`;
  
  // Check cache first
  const cached = getCachedData<boolean>(cacheKey);
  if (cached !== null) {
    return cached;
  }
  
  try {
    validateConfig();
    
    const fullPath = `${ENTRY_FOLDER}/${objectName}`;
    const resource = await getResource(fullPath, false);
    
    const exists = resource && resource.type === 'file';
    
    // Cache the result for 1 year
    setCachedData(cacheKey, exists, CACHE_DURATION);
    return exists;
  } catch (error) {
    // If we get an error, the file likely doesn't exist
    setCachedData(cacheKey, false, CACHE_DURATION);
    return false;
  }
}

// Get object metadata with caching
export async function getObjectMetadata(objectName: string) {
  // Return null during build to prevent API calls
  if (isBuildTime) {
    if (!isBuildTime) console.log(`Build-time bypass: returning null metadata for ${objectName}`);
    return null;
  }

  const cacheKey = `metadata:${objectName}`;
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    validateConfig();
    
    const fullPath = `${ENTRY_FOLDER}/${objectName}`;
    const metadata = await getResource(fullPath, false);
    
    // Cache the result for 1 year
    setCachedData(cacheKey, metadata, CACHE_DURATION);
    return metadata;
  } catch (error) {
    console.error(`Failed to get metadata for ${objectName}:`, error);
    throw error;
  }
}

// Initialize Filebrowser connection (validate config)
export async function initializeFilebrowser(): Promise<boolean> {
  // Skip initialization during build
  if (isBuildTime) {
    if (!isBuildTime) console.log('Skipping Filebrowser initialization during build');
    return true;
  }

  try {
    console.log('🚀 Initializing Filebrowser connection...');
    console.log(`  Environment variables:`);
    console.log(`    FILEBROWSER_BASE_URL: ${FILEBROWSER_BASE_URL || 'NOT SET'}`);
    console.log(`    FILEBROWSER_API_KEY: ${FILEBROWSER_API_KEY ? 'SET (length: ' + FILEBROWSER_API_KEY.length + ')' : 'NOT SET'}`);
    
    validateConfig();
    
    console.log(`🔗 Connecting to Filebrowser at ${FILEBROWSER_BASE_URL}`);
    console.log(`📁 Entry folder: ${ENTRY_FOLDER}`);
    
    // Test connection by trying to list the entry folder
    console.log('🧪 Testing connection by listing entry folder...');
    const resource = await getResource(ENTRY_FOLDER, false);
    
    if (resource.type !== 'directory') {
      throw new Error(`Entry folder ${ENTRY_FOLDER} is not a directory`);
    }
    
    console.log('✅ Filebrowser connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Filebrowser:', error);
    if (error instanceof Error && error.message.includes('fetch failed')) {
      console.error('💡 This usually means:');
      console.error('   1. FILEBROWSER_BASE_URL is incorrect or not set');
      console.error('   2. Filebrowser server is not running');
      console.error('   3. Network connectivity issues');
    }
    throw error;
  }
}

export { clearCache, ENTRY_FOLDER, SOURCE_NAME };
