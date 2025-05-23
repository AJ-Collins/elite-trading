declare global {
    interface Window {
      google: any; // Or a more specific type if needed
    }
  }
  
  export {};  // Ensures this file is treated as a module  