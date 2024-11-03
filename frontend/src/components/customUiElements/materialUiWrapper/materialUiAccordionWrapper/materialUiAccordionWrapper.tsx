import React from "react";
import Accordion, { AccordionProps } from "@mui/material/Accordion";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import { EonUiIcon, EonUiText } from "@eon-ui/eon-ui-components-react";

interface Props extends AccordionProps {
  children: NonNullable<React.ReactNode>;
  title: string;
}

const MaterialUiAccordionWrapper: React.FC<Props> = ({
  children,
  title,
  ...accordionProps
}) => {
  return (
    <Accordion
      defaultExpanded
      square
      sx={{
        backgroundColor: "#f9f6f4",
        borderRadius: "10px",
        marginBottom: "20px",
        "&::before": {
          display: "none", 
        },
      }}
      {...accordionProps}
    >
      <AccordionSummary expandIcon={<EonUiIcon name="arrow_down" />}>
        <EonUiText font-weight="bold">{title}</EonUiText>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default MaterialUiAccordionWrapper;
