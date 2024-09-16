import { AppDataSource } from '@/app/lib/ormconfig';


export async function connectToDatabase() {
    try {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
          console.log('Database connected');
        }
      } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Failed to connect to the database');
      }
}
