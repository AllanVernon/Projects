import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs, isLoading } = useSelector((store) => ({
    allAppliedJobs: store?.job?.allAppliedJobs ?? [],
    isLoading: store?.job?.isLoading ?? false,
  }));

  // Debug the selector output
//   console.log("allAppliedJobs:", allAppliedJobs);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table aria-label="Applied jobs table">
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Date</TableHead>
            <TableHead scope="col">Job Role</TableHead>
            <TableHead scope="col">Company</TableHead>
            <TableHead scope="col" className="text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                You haven't applied to any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>{appliedJob?.createdAt?.split("T")[0] || "N/A"}</TableCell>
                <TableCell>{appliedJob?.job?.title || "N/A"}</TableCell>
                <TableCell>{appliedJob?.job?.company?.name || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={
                      appliedJob.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }
                  >
                    {appliedJob.status?.toUpperCase() || "N/A"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;