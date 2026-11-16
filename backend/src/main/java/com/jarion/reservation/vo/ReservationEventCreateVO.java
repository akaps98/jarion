package com.jarion.reservation.vo;


import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReservationEventCreateVO {

    @NotBlank
    @Size(max = 100)
    private String eventName;

    @NotBlank
    @Size(max = 255)
    private String location;

    @NotNull
    @Min(1)
    @Max(60)
    private Integer boothRows;

    @NotNull
    @Min(1)
    @Max(60)
    private Integer boothCols;

    @NotEmpty
    @Valid
    private List<ReservationEventDayVO> days;
}
