import Link from "next/link";
import { getVenues } from "@/lib/actions/venue.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const query = searchParams.query;
  
  const { success, venues, pagination } = await getVenues({
    page,
    limit: 12,
    query,
  });

  if (!success || !venues) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Venues</h1>
        <p>Failed to load venues. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Venues</h1>
        <Link href="/venues/new">
          <Button>Add New Venue</Button>
        </Link>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No venues found</p>
          <Link href="/venues/new">
            <Button variant="outline">Create your first venue</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl truncate">{venue.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground text-sm truncate mb-2">
                    {venue.address}
                  </p>
                  {venue.description && (
                    <p className="line-clamp-2 text-sm">{venue.description}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href={`/venues/${venue.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {page > 1 && (
                <Link
                  href={{
                    pathname: "/venues",
                    query: { ...(query && { query }), page: page - 1 },
                  }}
                >
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              
              <div className="flex items-center px-4">
                Page {page} of {pagination.totalPages}
              </div>
              
              {page < pagination.totalPages && (
                <Link
                  href={{
                    pathname: "/venues",
                    query: { ...(query && { query }), page: page + 1 },
                  }}
                >
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 